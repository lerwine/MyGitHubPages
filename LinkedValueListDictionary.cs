using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace MyGitHubPages
{
    public class LinkedValueListDictionary<TKey, TValue> : IList<TValue>, IDictionary<TKey, TValue>, IDictionary, IList
    {
        private int _count = 0;
        private KeyList.KeyGroup.LinkedNode _firstNode = null;
        private KeyList.KeyGroup.LinkedNode _lastNode = null;
        private KeyList _keys;

        TValue IList<TValue>.this[int index] { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        TValue IDictionary<TKey, TValue>.this[TKey key] { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        object IDictionary.this[object key] { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        object IList.this[int index] { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

        int ICollection<TValue>.Count => throw new NotImplementedException();

        int ICollection<KeyValuePair<TKey, TValue>>.Count => throw new NotImplementedException();

        int ICollection.Count => throw new NotImplementedException();

        bool ICollection<TValue>.IsReadOnly => throw new NotImplementedException();

        bool ICollection<KeyValuePair<TKey, TValue>>.IsReadOnly => throw new NotImplementedException();

        bool IDictionary.IsReadOnly => throw new NotImplementedException();

        bool IList.IsReadOnly => throw new NotImplementedException();

        ICollection<TKey> IDictionary<TKey, TValue>.Keys => throw new NotImplementedException();

        ICollection IDictionary.Keys => throw new NotImplementedException();

        ICollection<TValue> IDictionary<TKey, TValue>.Values => throw new NotImplementedException();

        ICollection IDictionary.Values => throw new NotImplementedException();

        bool IDictionary.IsFixedSize => throw new NotImplementedException();

        bool IList.IsFixedSize => throw new NotImplementedException();

        object ICollection.SyncRoot => throw new NotImplementedException();

        bool ICollection.IsSynchronized => throw new NotImplementedException();

        public LinkedValueListDictionary(IEqualityComparer<TKey> keyComparer, IEqualityComparer<TValue> valueComparer, Func<TKey, bool> keyValidity, Func<TValue, bool> valueValidity)
        {
            _keys = new KeyList(this, keyComparer, valueComparer, keyValidity, valueValidity);
        }

        void ICollection<TValue>.Add(TValue item)
        {
            throw new NotImplementedException();
        }

        void IDictionary<TKey, TValue>.Add(TKey key, TValue value)
        {
            throw new NotImplementedException();
        }

        void ICollection<KeyValuePair<TKey, TValue>>.Add(KeyValuePair<TKey, TValue> item)
        {
            throw new NotImplementedException();
        }

        void IDictionary.Add(object key, object value)
        {
            throw new NotImplementedException();
        }

        int IList.Add(object value)
        {
            throw new NotImplementedException();
        }

        void ICollection<TValue>.Clear()
        {
            throw new NotImplementedException();
        }

        void ICollection<KeyValuePair<TKey, TValue>>.Clear()
        {
            throw new NotImplementedException();
        }

        void IDictionary.Clear()
        {
            throw new NotImplementedException();
        }

        void IList.Clear()
        {
            throw new NotImplementedException();
        }

        bool ICollection<TValue>.Contains(TValue item)
        {
            throw new NotImplementedException();
        }

        bool ICollection<KeyValuePair<TKey, TValue>>.Contains(KeyValuePair<TKey, TValue> item)
        {
            throw new NotImplementedException();
        }

        bool IDictionary.Contains(object key)
        {
            throw new NotImplementedException();
        }

        bool IList.Contains(object value)
        {
            throw new NotImplementedException();
        }

        bool IDictionary<TKey, TValue>.ContainsKey(TKey key)
        {
            throw new NotImplementedException();
        }

        void ICollection<TValue>.CopyTo(TValue[] array, int arrayIndex)
        {
            throw new NotImplementedException();
        }

        void ICollection<KeyValuePair<TKey, TValue>>.CopyTo(KeyValuePair<TKey, TValue>[] array, int arrayIndex)
        {
            throw new NotImplementedException();
        }

        void ICollection.CopyTo(Array array, int index)
        {
            throw new NotImplementedException();
        }

        IEnumerator<TValue> IEnumerable<TValue>.GetEnumerator()
        {
            throw new NotImplementedException();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            throw new NotImplementedException();
        }

        IEnumerator<KeyValuePair<TKey, TValue>> IEnumerable<KeyValuePair<TKey, TValue>>.GetEnumerator()
        {
            throw new NotImplementedException();
        }

        IDictionaryEnumerator IDictionary.GetEnumerator()
        {
            throw new NotImplementedException();
        }

        int IList<TValue>.IndexOf(TValue item)
        {
            throw new NotImplementedException();
        }

        int IList.IndexOf(object value)
        {
            throw new NotImplementedException();
        }

        void IList<TValue>.Insert(int index, TValue item)
        {
            throw new NotImplementedException();
        }

        void IList.Insert(int index, object value)
        {
            throw new NotImplementedException();
        }

        bool ICollection<TValue>.Remove(TValue item)
        {
            throw new NotImplementedException();
        }

        bool IDictionary<TKey, TValue>.Remove(TKey key)
        {
            throw new NotImplementedException();
        }

        bool ICollection<KeyValuePair<TKey, TValue>>.Remove(KeyValuePair<TKey, TValue> item)
        {
            throw new NotImplementedException();
        }

        void IDictionary.Remove(object key)
        {
            throw new NotImplementedException();
        }

        void IList.Remove(object value)
        {
            throw new NotImplementedException();
        }

        void IList<TValue>.RemoveAt(int index)
        {
            throw new NotImplementedException();
        }

        void IList.RemoveAt(int index)
        {
            throw new NotImplementedException();
        }

        bool IDictionary<TKey, TValue>.TryGetValue(TKey key, out TValue value)
        {
            throw new NotImplementedException();
        }

        public class KeyList : IList<KeyList.KeyGroup>, IList
        {
            private readonly object _syncRoot = new object();
            private int _count = 0;
            private readonly LinkedValueListDictionary<TKey, TValue> _owner;
            private KeyGroup _firstGroup = null;
            private KeyGroup _lastGroup = null;
            private readonly IEqualityComparer<TKey> _keyComparer;
            private readonly IEqualityComparer<TValue> _valueComparer;
            private readonly Func<TKey, bool> _keyValidity;
            private readonly Func<TValue, bool> _valueValidity;

            internal KeyList(LinkedValueListDictionary<TKey, TValue> owner, IEqualityComparer<TKey> keyComparer, IEqualityComparer<TValue> valueComparer, Func<TKey, bool> keyValidity, Func<TValue, bool> valueValidity)
            {
                _owner = owner;
                _keyComparer = keyComparer ?? EqualityComparer<TKey>.Default;
                _valueComparer = valueComparer ?? EqualityComparer<TValue>.Default;
                _keyValidity = keyValidity ?? new Func<TKey, bool>((TKey v) => (object)v != null);
                _valueValidity = valueValidity ?? new Func<TValue, bool>((TValue v) => (object)v != null);
            }

            public KeyGroup FirstGroup { get { return _firstGroup; } }

            public KeyGroup LastGroup { get { return _lastGroup; } }

            KeyGroup IList<KeyGroup>.this[int index] { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
            object IList.this[int index] { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

            int ICollection<KeyGroup>.Count => throw new NotImplementedException();

            int ICollection.Count => throw new NotImplementedException();

            bool ICollection<KeyGroup>.IsReadOnly => throw new NotImplementedException();

            bool IList.IsReadOnly => throw new NotImplementedException();

            bool IList.IsFixedSize => throw new NotImplementedException();

            object ICollection.SyncRoot => throw new NotImplementedException();

            bool ICollection.IsSynchronized => throw new NotImplementedException();

            void ICollection<KeyGroup>.Add(KeyGroup item)
            {
                throw new NotImplementedException();
            }

            int IList.Add(object value)
            {
                throw new NotImplementedException();
            }

            void ICollection<KeyGroup>.Clear()
            {
                throw new NotImplementedException();
            }

            void IList.Clear()
            {
                throw new NotImplementedException();
            }

            bool ICollection<KeyGroup>.Contains(KeyGroup item)
            {
                throw new NotImplementedException();
            }

            bool IList.Contains(object value)
            {
                throw new NotImplementedException();
            }

            void ICollection<KeyGroup>.CopyTo(KeyGroup[] array, int arrayIndex)
            {
                throw new NotImplementedException();
            }

            void ICollection.CopyTo(Array array, int index)
            {
                throw new NotImplementedException();
            }

            IEnumerator<KeyGroup> IEnumerable<KeyGroup>.GetEnumerator()
            {
                throw new NotImplementedException();
            }

            IEnumerator IEnumerable.GetEnumerator()
            {
                throw new NotImplementedException();
            }

            int IList<KeyGroup>.IndexOf(KeyGroup item)
            {
                throw new NotImplementedException();
            }

            int IList.IndexOf(object value)
            {
                throw new NotImplementedException();
            }

            void IList<KeyGroup>.Insert(int index, KeyGroup item)
            {
                throw new NotImplementedException();
            }

            void IList.Insert(int index, object value)
            {
                throw new NotImplementedException();
            }

            bool ICollection<KeyGroup>.Remove(KeyGroup item)
            {
                throw new NotImplementedException();
            }

            void IList.Remove(object value)
            {
                throw new NotImplementedException();
            }

            void IList<KeyGroup>.RemoveAt(int index)
            {
                throw new NotImplementedException();
            }

            void IList.RemoveAt(int index)
            {
                throw new NotImplementedException();
            }
            
            public class KeyGroup : ICollection<TValue>, ICollection
            {
                private TKey _key;
                private int _count = 0;
                private LinkedNode _firstNode = null;
                private LinkedNode _lastNode = null;
                private KeyList _owner;
                private KeyGroup _previous;
                private KeyGroup _next;

                public TKey Key { get { return _key; } }
                public LinkedNode FirstNode { get { return _firstNode; } }
                public LinkedNode LastNode { get { return _lastNode; } }
                public KeyGroup Previous { get { return _previous; } }
                public KeyGroup Next { get { return _next; } }

                int ICollection<TValue>.Count => throw new NotImplementedException();

                int ICollection.Count => throw new NotImplementedException();

                bool ICollection<TValue>.IsReadOnly => throw new NotImplementedException();

                object ICollection.SyncRoot => throw new NotImplementedException();

                bool ICollection.IsSynchronized => throw new NotImplementedException();

                void ICollection<TValue>.Add(TValue item)
                {
                    throw new NotImplementedException();
                }

                void ICollection<TValue>.Clear()
                {
                    throw new NotImplementedException();
                }

                bool ICollection<TValue>.Contains(TValue item)
                {
                    throw new NotImplementedException();
                }

                void ICollection<TValue>.CopyTo(TValue[] array, int arrayIndex)
                {
                    throw new NotImplementedException();
                }

                void ICollection.CopyTo(Array array, int index)
                {
                    throw new NotImplementedException();
                }

                IEnumerator<TValue> IEnumerable<TValue>.GetEnumerator()
                {
                    throw new NotImplementedException();
                }

                IEnumerator IEnumerable.GetEnumerator()
                {
                    throw new NotImplementedException();
                }

                bool ICollection<TValue>.Remove(TValue item)
                {
                    throw new NotImplementedException();
                }

                public class LinkedNode
                {
                    private TValue _value;
                    private LinkedNode _previous;
                    private LinkedNode _next;
                    private LinkedNode _previousInKeyGroup;
                    private LinkedNode _nextInKeyGroup;
                    private KeyGroup _group;

                    public TValue Value { get { return _value; } }
                    public TKey Key { get { return _group._key; } }
                    public LinkedNode Previous { get { return _previous; } }
                    public LinkedNode Next { get { return _next; } }
                    public LinkedNode PreviousInKeyGroup { get { return _previousInKeyGroup; } }
                    public LinkedNode NextInKeyGroup { get { return _nextInKeyGroup; } }
                    public KeyGroup Group { get { return _group; } }
                }
            }
        }
    }
}
