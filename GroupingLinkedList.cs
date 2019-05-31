using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace MyGitHubPages
{
    public class GroupingLinkedList<TKey, TValue> : IList<TValue>, IDictionary<TKey, TValue>, IList, IDictionary
    {
        private object _syncRoot = new object();
        private LinkedNode.Group.Dictionary _dictionary;
        private LinkedNode _firstNode = null;
        private LinkedNode _lastNode = null;
        private int _count = 0;
        private readonly IEqualityComparer<TKey> _keyComparer;
        private readonly IEqualityComparer<TValue> _valueComparer;

        #region Properties

        public TValue this[int index]
        {
            get
            {
                LinkedNode node = Get(index);
                if (node == null)
                    throw new IndexOutOfRangeException();
                return node.Value;
            }
        }

        TValue IList<TValue>.this[int index] { get { return this[index]; } set => throw new NotSupportedException(); }

        object IList.this[int index] { get { return this[index]; } set => throw new NotImplementedException(); }

        object IDictionary.this[object key] { get { return _dictionary[(TKey)key]; } set { _dictionary[(TKey)key] = (TValue)value; } }

        TValue IDictionary<TKey, TValue>.this[TKey key] { get { return _dictionary[key]; } set { _dictionary[key] = value; } }

        public int Count { get { return _count; } }

        public LinkedNode.Group.Dictionary Dictionary { get { return _dictionary; } }

        public LinkedNode FirstNode { get { return _firstNode; } }

        bool IDictionary.IsFixedSize { get { return false; } }

        bool IList.IsFixedSize { get { return false; } }

        bool ICollection<TValue>.IsReadOnly { get { return false; } }

        bool ICollection<KeyValuePair<TKey, TValue>>.IsReadOnly { get { return false; } }

        bool IDictionary.IsReadOnly { get { return false; } }

        bool IList.IsReadOnly { get { return false; } }

        bool ICollection.IsSynchronized { get { return true; } }

        public ICollection<TKey> Keys { get { return _dictionary.Keys; } }

        ICollection IDictionary.Keys { get { return _dictionary.Keys; } }

        public LinkedNode LastNode { get { return _lastNode; } }

        ICollection<TValue> IDictionary<TKey, TValue>.Values { get { return this; } }

        ICollection IDictionary.Values { get { return this; } }

        object ICollection.SyncRoot { get { return _syncRoot; } }

        #endregion

        public GroupingLinkedList(IEqualityComparer<TKey> keyComparer, IEqualityComparer<TValue> valueComparer, IEnumerable<IGrouping<TKey, TValue>> values)
        {
            _keyComparer = keyComparer ?? EqualityComparer<TKey>.Default;
            _valueComparer = valueComparer ?? EqualityComparer<TValue>.Default;
            _dictionary = new LinkedNode.Group.Dictionary(this, values);
        }

        #region Methods

        void ICollection<TValue>.Add(TValue item) { throw new NotSupportedException(); }

        public void Add(TKey key, TValue value) { _dictionary.Add(key, value); }

        void ICollection<KeyValuePair<TKey, TValue>>.Add(KeyValuePair<TKey, TValue> item) { _dictionary.Add(item.Key, item.Value); }

        void IDictionary.Add(object key, object value) { _dictionary.Add((TKey)key, (TValue)value); }

        int IList.Add(object value) { return _dictionary.Add((IGrouping<TKey, TValue>)value); }
        
        public void Clear() { _dictionary.Clear(); }

        public bool Contains(TValue item) { return GetItems().Select(i => i.Value).Contains(item, _valueComparer); }

        bool ICollection<KeyValuePair<TKey, TValue>>.Contains(KeyValuePair<TKey, TValue> item) { return _dictionary.Contains(item); }

        bool IList.Contains(object value) { return value != null && value is TValue && Contains((TValue)value); }

        public bool ContainsKey(TKey key) { return _dictionary.ContainsKey(key); }

        bool IDictionary.Contains(object key) { return _dictionary.Contains(key); }

        public void CopyTo(TValue[] array, int arrayIndex) { GetItems().Select(i => i.Value).ToList().CopyTo(array, arrayIndex); }

        void ICollection<KeyValuePair<TKey, TValue>>.CopyTo(KeyValuePair<TKey, TValue>[] array, int arrayIndex) { GetItems().Select(i => new KeyValuePair<TKey, TValue>(i.Grouping.Key, i.Value)).ToList().CopyTo(array, arrayIndex); }

        void ICollection.CopyTo(Array array, int index) { GetItems().Select(i => i.Value).ToArray().CopyTo(array, index); }

        protected LinkedNode Get(int index) => _dictionary.GetSync(() =>
        {
            LinkedNode node;
            if (index == 0)
                return _firstNode;
            int i = _count - 1;
            if (index == i)
                return _lastNode;
            if (index < 0 || index > i)
                return null;
            if (index > i >> 1)
            {
                node = _lastNode;
                while (i > index)
                {
                    if ((node = node.Previous) == null)
                        break;
                    i--;
                }
            }
            else
            {
                node = _firstNode;
                for (i = 0; i < index; i++)
                {
                    if ((node = node.Next) == null)
                        break;
                }
            }
            return node;
        });

        protected IEnumerable<LinkedNode> GetItems()
        {
            for (LinkedNode node = _firstNode; node != null; node = node.Next)
                yield return node;
        }

        public IEnumerator<TValue> GetEnumerator() { return GetItems().Select(i => i.Value).GetEnumerator(); }

        IEnumerator IEnumerable.GetEnumerator() { return GetEnumerator(); }

        IEnumerator<KeyValuePair<TKey, TValue>> IEnumerable<KeyValuePair<TKey, TValue>>.GetEnumerator() { return _dictionary.GetEnumerator(); }

        IDictionaryEnumerator IDictionary.GetEnumerator() { return _dictionary.GetEnumerator(); }

        public int IndexOf(TValue item) => _dictionary.GetSync(() => {
            int index = 0;
            for (LinkedNode node = _firstNode; node != null; node = node.Next)
            {
                if (_valueComparer.Equals(node.Value, item))
                    return index;
                index++;
            }
            return -1;
        });
        
        int IList.IndexOf(object value) { return (value != null && value is TValue) ? IndexOf((TValue)value) : -1; }

        public void Insert(TKey key, int index, TValue item) { _dictionary.Set(key, index, item); }

        void IList<TValue>.Insert(int index, TValue item) { throw new NotSupportedException(); }

        void IList.Insert(int index, object value) { throw new NotSupportedException(); }

        public bool Remove(TKey key) { return _dictionary.Remove(key); }
        
        public bool Remove(TValue item) => _dictionary.GetSync(() =>
        {
            int index = 0;
            for (LinkedNode node = _firstNode; node != null; node = node.Next)
            {
                if (_valueComparer.Equals(node.Value, item))
                {
                    _dictionary.Remove(node);
                    return true;
                }
                index++;
            }
            return false;
        });

        bool ICollection<KeyValuePair<TKey, TValue>>.Remove(KeyValuePair<TKey, TValue> item) { return _dictionary.Remove(item.Key, item.Value); }

        void IDictionary.Remove(object key) { _dictionary.Remove((TKey)key); }

        void IList.Remove(object value)
        {
            if (value != null && value is TValue)
                Remove((TValue)value);
        }

        public void RemoveAt(int index) => _dictionary.InvokeSync(() =>
        {
            LinkedNode node = Get(index);
            if (node == null)
                throw new ArgumentOutOfRangeException("index");
            _dictionary.Remove(node);
        });

        public void Set(TKey key, int index, TValue value) { _dictionary.Set(key, index, value); }

        public void Set(TKey key, TValue value) { _dictionary[key] = value; }

        public bool TryGetValue(TKey key, out TValue value) { return _dictionary.TryGetValue(key, out value); }
        
        #endregion

        public sealed class LinkedNode
        {
            private TValue _value;
            private Group _grouping;
            private GroupLink _groupLink;
            private LinkedNode _previous;
            private LinkedNode _next;
            private GroupLink _previousInGroup = null;
            private GroupLink _nextInGroup = null;

            public LinkedNode(TValue value, LinkedNode previous)
            {
                _value = value;
                if ((_previous = previous) == null)
                    _next = null;
                else if ((_next = previous._next) != null)
                    _next._previous = this;
                _groupLink = new GroupLink(this);
            }

            public TValue Value { get { return _value; } }

            public Group Grouping { get { return _grouping; } }

            public LinkedNode Previous { get { return _previous; } }

            public LinkedNode Next { get { return _next; } }

            public sealed class GroupLink
            {
                private readonly LinkedNode _owner;

                public TValue Value { get { return _owner.Value; } }

                public GroupLink Previous { get { return _owner._previousInGroup; } }

                public GroupLink Next { get { return _owner._nextInGroup; } }

                internal GroupLink(LinkedNode owner) { _owner = owner; }
            }

            public sealed class Group : IGrouping<TKey, TValue>, ICollection<TValue>, ICollection
            {
                private Dictionary _owner;
                private TKey _key;
                private int _count = 1;
                private LinkedNode _firstNode;
                private LinkedNode _lastNode;
                private Group _previous;
                private Group _next;

                public Group(TKey key, LinkedNode value, Group previous)
                {
                    _key = key;
                    _firstNode = _lastNode = value;
                    if ((_previous = previous) == null)
                        _next = null;
                    else
                    {
                        if ((_next = previous._next) != null)
                            _next._previous = this;
                        previous._next = this;
                    }
                    value._grouping = this;
                }

                #region Properties

                public TValue this[int index]
                {
                    get
                    {
                        GroupLink node = Get(index);
                        if (node == null)
                            throw new IndexOutOfRangeException();
                        return node.Value;
                    }
                }

                public GroupLink FirstNode { get { return _firstNode._groupLink; } }

                public GroupLink LastNode { get { return _lastNode._groupLink; } }

                public Group Previous { get { return _previous; } }

                public Group Next { get { return _next; } }

                public TKey Key { get { return _key; } }

                public int Count { get { return _count; } }

                public bool IsReadOnly { get { return false; } }

                public object SyncRoot { get { return _owner.SyncRoot; } }

                public bool IsSynchronized { get { return true; } }

                #endregion

                #region Methods

                public void Add(TValue item) { _owner.Add(item, this); }

                public void Clear() { _owner.Clear(); }

                public bool Contains(TValue item) { return _owner.Contains(item); }

                public void CopyTo(TValue[] array, int arrayIndex) { GetItems().Select(i => i.Value).ToList().CopyTo(array, arrayIndex); }

                public void CopyTo(Array array, int index) { GetItems().Select(i => i.Value).ToArray().CopyTo(array, index); }

                private GroupLink Get(int index) => _owner.GetSync(() =>
                {
                    GroupLink node;
                    if (index == 0)
                        return _firstNode._groupLink;
                    int i = _count - 1;
                    if (index == i)
                        return _lastNode._groupLink;
                    if (index < 0 || index > i)
                        return null;
                    if (index > i >> 1)
                    {
                        node = _lastNode._groupLink;
                        while (i > index)
                        {
                            if ((node = node.Previous) == null)
                                break;
                            i--;
                        }
                    }
                    else
                    {
                        node = _firstNode._groupLink;
                        for (i = 0; i < index; i++)
                        {
                            if ((node = node.Next) == null)
                                break;
                        }
                    }
                    return node;
                });

                private IEnumerable<GroupLink> GetItems()
                {
                    for (GroupLink g = _firstNode._groupLink; g != null; g = g.Next)
                        yield return g;
                }

                public IEnumerator<TValue> GetEnumerator() { return GetItems().Select(i => i.Value).GetEnumerator(); }

                public bool Remove(TValue item) { return _owner.Remove(item, this); }

                IEnumerator IEnumerable.GetEnumerator() { return GetEnumerator(); }

                #endregion

                public sealed class Dictionary : IDictionary<TKey, TValue>, IEnumerable<IGrouping<TKey, TValue>>, IDictionary
                {
                    private object _syncRoot = new object();
                    private GroupingLinkedList<TKey, TValue> _owner;
                    private KeyCollection _keys;
                    private Group _firstGroup = null;
                    private Group _lastGroup = null;
                    private int _count = 0;

                    #region Properties

                    public TValue this[TKey key]
                    {
                        get
                        {
                            Group g = Get(key);
                            if (g == null)
                                throw new KeyNotFoundException();
                            return g._firstNode.Value;
                        }
                        set
                        {
                            if (key == null)
                                throw new ArgumentNullException("key");
                            InvokeSync(() =>
                            {
                                Group g = Get(key);

                                if (g == null)
                                {
                                    _owner._lastNode = new LinkedNode(value, _owner._lastNode);
                                    _lastGroup = new Group(key, _owner._lastNode, _lastGroup);
                                }
                                else
                                {
                                    g._firstNode._value = value;
                                    LinkedNode n = g._firstNode;
                                    while (n._nextInGroup != null)
                                        Remove(n._nextInGroup);
                                }
                            });
                        }
                    }

                    object IDictionary.this[object key] { get { return this[(TKey)key]; } set { this[(TKey)key] = (TValue)value; } }

                    public KeyCollection Keys { get { return _keys; } }

                    ICollection<TKey> IDictionary<TKey, TValue>.Keys { get { return Keys; } }

                    ICollection IDictionary.Keys { get { return Keys; } }

                    public GroupingLinkedList<TKey, TValue> Values { get { return _owner; } }

                    ICollection<TValue> IDictionary<TKey, TValue>.Values { get { return _owner; } }

                    ICollection IDictionary.Values { get { return _owner; } }

                    public int Count { get { return _count; } }

                    internal object SyncRoot { get { return _owner._syncRoot; } }

                    object ICollection.SyncRoot { get { return _owner._syncRoot; } }

                    bool ICollection<KeyValuePair<TKey, TValue>>.IsReadOnly { get { return false; } }

                    bool IDictionary.IsReadOnly { get { return false; } }

                    bool IDictionary.IsFixedSize { get { return false; } }

                    bool ICollection.IsSynchronized { get { return true; } }

                    #endregion

                    internal Dictionary(GroupingLinkedList<TKey, TValue> owner, IEnumerable<IGrouping<TKey, TValue>> values)
                    {
                        if (owner._dictionary != null)
                            throw new InvalidOperationException();
                        _owner = owner;
                        _keys = new KeyCollection(this);
                    }

                    #region Methods

                    internal int Add(TValue item, Group group) => GetSync<int>(() =>
                    {
                        throw new NotImplementedException();
                    });

                    public void Add(TKey key, TValue value) => InvokeSync(() =>
                    {
                        throw new NotImplementedException();
                    });

                    public int Add(IGrouping<TKey, TValue> value) => GetSync<int>(() =>
                    {
                        throw new NotImplementedException();
                    });

                    void ICollection<KeyValuePair<TKey, TValue>>.Add(KeyValuePair<TKey, TValue> item) { Add(item.Key, item.Value); }

                    void IDictionary.Add(object key, object value) { Add((TKey)key, (TValue)value); }

                    public void Clear() => InvokeSync(() =>
                    {
                        throw new NotImplementedException();
                    });

                    public bool Contains(TValue value) => GetSync<bool>(() =>
                    {
                        throw new NotImplementedException();
                    });

                    public bool ContainsKey(TKey key) => GetSync<bool>(() =>
                    {
                        throw new NotImplementedException();
                    });

                    bool ICollection<KeyValuePair<TKey, TValue>>.Contains(KeyValuePair<TKey, TValue> item) => GetSync<bool>(() =>
                    {
                        throw new NotImplementedException();
                    });

                    bool IDictionary.Contains(object key) { return key != null && key is TKey && ContainsKey((TKey)key); }

                    public void CopyTo(IGrouping<TKey, TValue>[] array, int arrayIndex) { GetGroups().Cast<IGrouping<TKey, TValue>>().ToList().CopyTo(array, arrayIndex); }

                    public void CopyTo(KeyValuePair<TKey, TValue>[] array, int arrayIndex) { GetGroups().Select(g => new KeyValuePair<TKey, TValue>(g.Key, g._firstNode.Value)).ToList().CopyTo(array, arrayIndex); }

                    void ICollection.CopyTo(Array array, int index) { GetGroups().Select(g => new KeyValuePair<TKey, TValue>(g.Key, g._firstNode.Value)).ToArray().CopyTo(array, index); }

                    internal Group Get(TKey key) => GetSync(() =>
                    {
                        for (Group g = _firstGroup; g != null; g = g._next)
                        {
                            if (_owner._keyComparer.Equals(g._key, key))
                                return g;
                        }
                        return null;
                    });

                    public DictionaryEnumerator GetEnumerator() { return new DictionaryEnumerator(GetGroups().GetEnumerator()); }

                    IEnumerator<IGrouping<TKey, TValue>> IEnumerable<IGrouping<TKey, TValue>>.GetEnumerator() { return GetEnumerator(); }

                    IEnumerator<KeyValuePair<TKey, TValue>> IEnumerable<KeyValuePair<TKey, TValue>>.GetEnumerator() { return GetEnumerator(); }

                    IDictionaryEnumerator IDictionary.GetEnumerator() { return GetEnumerator(); }

                    IEnumerator IEnumerable.GetEnumerator() { return GetEnumerator(); }

                    internal IEnumerable<Group> GetGroups()
                    {
                        for (Group node = _firstGroup; node != null; node = node._next)
                            yield return node;
                    }

                    internal bool Remove(TValue item, Group group)
                    {
                        throw new NotImplementedException();
                    }

                    public bool Remove(TKey key, TValue value) { throw new NotImplementedException(); }

                    public bool Remove(TKey key) { throw new NotImplementedException(); }

                    internal void Remove(GroupLink nextInGroup)
                    {
                        throw new NotImplementedException();
                    }

                    internal void Remove(LinkedNode node)
                    {
                        throw new NotImplementedException();
                    }
                    
                    void IDictionary.Remove(object key)
                    {
                        throw new NotImplementedException();
                    }

                    bool ICollection<KeyValuePair<TKey, TValue>>.Remove(KeyValuePair<TKey, TValue> item)
                    {
                        throw new NotImplementedException();
                    }
                    
                    public void Set(TKey key, int index, TValue value)
                    {
                        throw new NotImplementedException();
                    }

                    public void InvokeSync(Action action)
                    {
                        Monitor.Enter(_syncRoot);
                        try { action(); }
                        finally { Monitor.Exit(_syncRoot); }
                    }

                    public T GetSync<T>(Func<T> func)
                    {
                        Monitor.Enter(_syncRoot);
                        try { return func(); }
                        finally { Monitor.Exit(_syncRoot); }
                    }

                    public bool TryGetValue(TKey key, out TValue value) { throw new NotImplementedException(); }

                    #endregion

                    public sealed class KeyCollection : ICollection<TKey>, ICollection
                    {
                        private Dictionary _owner;

                        public KeyCollection(Dictionary owner) { _owner = owner; }

                        public int Count => throw new NotImplementedException();
                        
                        bool ICollection<TKey>.IsReadOnly => throw new NotImplementedException();

                        object ICollection.SyncRoot => throw new NotImplementedException();

                        bool ICollection.IsSynchronized => throw new NotImplementedException();

                        void ICollection<TKey>.Add(TKey item) { throw new NotSupportedException(); }

                        void ICollection<TKey>.Clear() { throw new NotSupportedException(); }

                        bool ICollection<TKey>.Contains(TKey item) { throw new NotImplementedException(); }

                        void ICollection<TKey>.CopyTo(TKey[] array, int arrayIndex) { throw new NotImplementedException(); }

                        void ICollection.CopyTo(Array array, int index) { throw new NotImplementedException(); }

                        IEnumerator<TKey> IEnumerable<TKey>.GetEnumerator() { throw new NotImplementedException(); }

                        IEnumerator IEnumerable.GetEnumerator() { throw new NotImplementedException(); }

                        bool ICollection<TKey>.Remove(TKey item) { throw new NotSupportedException(); }
                    }

                    public sealed class DictionaryEnumerator : IEnumerator<Group>, IEnumerator<IGrouping<TKey, TValue>>, IEnumerator<KeyValuePair<TKey, TValue>>, IDictionaryEnumerator
                    {
                        private IEnumerator<Group> _innerEnumerator;
                        private IEnumerator<Group> enumerator;

                        public DictionaryEnumerator(IEnumerator<Group> enumerator) { this.enumerator = enumerator; }

                        public Group Current => _innerEnumerator.Current;

                        IGrouping<TKey, TValue> IEnumerator<IGrouping<TKey, TValue>>.Current => throw new NotImplementedException();

                        KeyValuePair<TKey, TValue> IEnumerator<KeyValuePair<TKey, TValue>>.Current => throw new NotImplementedException();

                        object IEnumerator.Current => _innerEnumerator.Current;

                        public TKey Key => throw new NotImplementedException();

                        public TValue Value => throw new NotImplementedException();

                        public DictionaryEntry Entry => throw new NotImplementedException();

                        object IDictionaryEnumerator.Key => throw new NotImplementedException();

                        object IDictionaryEnumerator.Value => throw new NotImplementedException();

                        public void Dispose() { _innerEnumerator.Dispose(); }

                        public bool MoveNext() { return _innerEnumerator.MoveNext(); }

                        public void Reset() { _innerEnumerator.Reset(); }
                    }
                }
            }
        }
    }
}
